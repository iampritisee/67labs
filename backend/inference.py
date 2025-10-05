import torch
import cv2 as cv
import numpy as np
import json
from torchvision import transforms
from mictranet import MiCTRANet, init_lstm_hidden
from utils import get_ctc_vocab, beam_decode


class FingerspellingInference:
    def __init__(self, model_path, char_mappings_path):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Load char mappings
        with open(char_mappings_path, 'r') as f:
            config = json.load(f)
        
        char_list = config.get('chars', ' &.@acbedgfihkjmlonqpsrutwvyxz')
        self.vocab_map, self.inv_vocab_map, self.char_list = get_ctc_vocab(char_list)
        
        # Model config
        self.img_size = 224
        self.map_size = 14
        self.hidden_size = 512
        self.beam_size = 5
        
        # Load model
        self.model = MiCTRANet(
            backbone='resnet34',
            hidden_size=self.hidden_size,
            attn_size=512,
            output_size=len(self.char_list),
            mode='offline'
        )
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.to(self.device)
        self.model.eval()
        print(f"Model loaded on {self.device}")
    
    def predict(self, video_path):
        """Process video and return predicted text"""
        frames = self._load_video(video_path)
        if len(frames) == 0:
            raise ValueError("No frames extracted from video")
        
        imgs_tensor, maps_tensor = self._preprocess_frames(frames)
        
        with torch.no_grad():
            h0 = init_lstm_hidden(1, self.hidden_size, device=self.device)
            probs = self.model(imgs_tensor, h0, maps_tensor)[0].cpu().numpy()[0]
        
        pred = beam_decode(probs, self.beam_size, self.inv_vocab_map, 
                          self.vocab_map, digit=False)
        return ''.join(pred)
    
    def _load_video(self, video_path):
        """Extract frames from video"""
        cap = cv.VideoCapture(video_path)
        frames = []
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            frame_rgb = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
            frames.append(frame_rgb)
        cap.release()
        return frames
    
    def _preprocess_frames(self, frames):
        """Preprocess frames and compute attention maps"""
        # Resize frames
        processed_frames = []
        gray_frames = []
        
        for frame in frames:
            resized = cv.resize(frame, (self.img_size, self.img_size))
            processed_frames.append(resized)
            gray_frames.append(cv.cvtColor(resized, cv.COLOR_RGB2GRAY))
        
        # Compute optical flows and attention maps
        flows = self._get_optical_flows(gray_frames)
        priors = self._get_attention_priors(flows)
        maps = self._get_attention_maps(priors)
        
        # Convert frames to tensor
        imgs = np.stack(processed_frames)
        imgs_tensor = torch.from_numpy(imgs).float().permute(0, 3, 1, 2)
        imgs_tensor = imgs_tensor / 255.0
        mean = torch.tensor([0.485, 0.456, 0.406]).view(1, 3, 1, 1)
        std = torch.tensor([0.229, 0.224, 0.225]).view(1, 3, 1, 1)
        imgs_tensor = (imgs_tensor - mean) / std
        imgs_tensor = imgs_tensor.unsqueeze(0).to(self.device)
        
        return imgs_tensor, maps
    
    def _frobenius_norm(self, img1, img2):
        """Calculates the average pixel squared distance between 2 gray scale images."""
        return np.power(img2.astype(float) - img1.astype(float), 2).sum() / np.prod(img1.shape)
    
    def _get_optical_flows(self, frames):
        """Calculates the optical flows for a sequence of image frames in gray scale.
        Returns the magnitude of the flows.
        """
        # Optical flows can be computed in smaller resolution w/o harming performance
        frames = [cv.resize(frames[i], (self.img_size // 2, self.img_size // 2)) 
                  for i in range(len(frames))]
        frame1 = frames[0]
        
        # Insert a black image to obtain a list with the same length as `frames`
        flow_mag = np.zeros(frame1.shape[:2], dtype=np.float32)
        flows = [flow_mag]
        
        for i in range(1, len(frames)):
            frame2 = frames[i]
            
            # Use the Frobenius norm to detect still frames
            if self._frobenius_norm(frame1, frame2) > 1:  # manually tuned at training time
                opt_flow = cv.calcOpticalFlowFarneback(
                    frame1, frame2, None, 0.5, 3, 15, 3, 5, 1.2, 0
                )
                mag, _ = cv.cartToPolar(opt_flow[..., 0], opt_flow[..., 1])
                
                if (mag.max() - mag.min()) == 0:
                    flow_mag = np.zeros_like(mag, dtype=np.float32)
                elif mag.max() == np.inf:
                    mag = np.nan_to_num(mag, copy=True, posinf=mag.min())
                    flow_mag = (mag - mag.min()) / float(mag.max() - mag.min())
                else:
                    flow_mag = (mag - mag.min()) / float(mag.max() - mag.min())
            
            # Copy the new flow's magnitude or the previous one if a still frame was detected
            flows.append(flow_mag)
            frame1 = frame2
        
        return flows
    
    def _get_attention_priors(self, flows, window_size=3):
        """Priors are a moving average of optical flows of the
        requested `window_size` centered on the current frame."""
        # Prepend & append black images to obtain a list with the same length as `flows`
        flows = [np.zeros_like(flows[0]) for _ in range(window_size//2)] + flows + \
                [np.zeros_like(flows[0]) for _ in range(window_size//2)]
        flows = np.stack(flows, axis=0)
        
        priors = []
        for i in range(len(flows) - 2*(window_size//2)):
            prior = 255 * np.mean(flows[i: i + window_size], axis=0)
            priors.append(prior.astype('uint8'))
        return priors
    
    def _get_attention_maps(self, priors):
        """Resize priors to obtain spatial attention maps of the same size
        as the output feature maps of the CNN."""
        maps = [cv.resize(prior, (self.map_size, self.map_size)).astype(np.float32) 
                for prior in priors]
        maps = torch.from_numpy(np.asarray(maps)).unsqueeze(0).to(self.device)
        return maps