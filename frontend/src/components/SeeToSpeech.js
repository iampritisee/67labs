import React, { useEffect, useState } from "react";

export default function SeeToSpeech() {
		// The required path per request.
		const path = "/webgazer/www/keyboard.html";

		const [checking, setChecking] = useState(true);

		useEffect(() => {
			let cancelled = false;

			async function checkAndNavigate() {
				try {
					// First try HEAD, fall back to GET if HEAD fails (some servers don't allow HEAD)
					let ok = false;
					try {
						const resp = await fetch(path, { method: "HEAD", cache: "no-cache" });
						ok = resp && resp.ok;
					} catch (e) {
						try {
							const resp2 = await fetch(path, { method: "GET", cache: "no-cache" });
							ok = resp2 && resp2.ok;
						} catch (e2) {
							ok = false;
						}
					}

					if (ok && !cancelled) {
						// Redirect the full window to the keyboard page (same tab)
						window.location.href = path;
						return;
					}
				} catch (err) {
					// ignore
				} finally {
					if (!cancelled) setChecking(false);
				}
			}

			checkAndNavigate();

			return () => {
				cancelled = true;
			};
		}, []);

		const openSameTab = () => {
			window.location.href = path;
		};

		return (
			<div style={{ textAlign: "center" }}>
				<h2>See → Speech</h2>
				{checking ? (
					<p>Opening the WebGazer keyboard page...</p>
				) : (
					<>
						<p style={{ color: "#333" }}>Couldn't open automatically.</p>
						<div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
							<button onClick={openSameTab}>Open keyboard (same tab)</button>
							<a href={path} target="_self" rel="noreferrer">Open keyboard (link)</a>
						</div>
						<p style={{ marginTop: "1rem", color: "#666" }}>
							Make sure the folder <code>webgazer/www</code> is reachable at this path.
						</p>
					</>
				)}
			</div>
		);
}
