# Add this to inference.py __init__ before loading:
checkpoint = torch.load(model_path, map_location=self.device)
fc_weight_shape = checkpoint['fc.weight'].shape
print(f"Checkpoint expects {fc_weight_shape[0]} classes")

# Then check your vocab
print(f"Your vocab has {len(self.char_list)} classes")
print(f"Characters: {repr(self.char_list)}")