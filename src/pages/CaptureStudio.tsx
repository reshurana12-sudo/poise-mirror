import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, Video, Circle, RotateCcw, ArrowRight, Lightbulb, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/AppLayout";
import OnboardingWalkthrough from "@/components/OnboardingWalkthrough";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

type CaptureMode = "camera" | "photo" | "video";

const CaptureStudio = () => {
  const [mode, setMode] = useState<CaptureMode>("camera");
  const [captured, setCaptured] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStreaming(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    setCaptured(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStreaming(true);
    } catch (err: any) {
      const msg =
        err.name === "NotAllowedError"
          ? "Camera access denied. Please allow camera permissions in your browser settings."
          : err.name === "NotFoundError"
          ? "No camera found. Please connect a camera and try again."
          : `Camera error: ${err.message}`;
      setCameraError(msg);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    stopStream();
    setCaptured(true);
  }, [stopStream]);

  const retake = useCallback(() => {
    setCaptured(false);
    if (mode === "camera") startCamera();
  }, [mode, startCamera]);

  useEffect(() => {
    if (mode === "camera") {
      startCamera();
    } else {
      stopStream();
      setCaptured(false);
      setCameraError(null);
    }
    return () => stopStream();
  }, [mode, startCamera, stopStream]);

  const modes = [
    { id: "camera" as const, icon: Camera, label: "Camera" },
    { id: "photo" as const, icon: Upload, label: "Upload Photo" },
    { id: "video" as const, icon: Video, label: "Upload Video" },
  ];

  return (
    <AppLayout>
      <OnboardingWalkthrough />
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold">Capture Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">Position yourself naturally for the best analysis results</p>
        </div>

        <div className="grid lg:grid-cols-[200px_1fr] gap-6">
          {/* Mode Selector */}
          <div className="space-y-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  mode === m.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <m.icon className="w-4 h-4" />
                {m.label}
              </button>
            ))}

            {/* Tips */}
            <div className="mt-6 p-4 glass-panel space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-primary/80">
                <Lightbulb className="w-3.5 h-3.5" />
                Quick Tips
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>• Face the camera directly</li>
                <li>• Use even, natural lighting</li>
                <li>• Keep shoulders relaxed</li>
                <li>• Neutral expression works best</li>
              </ul>
            </div>
          </div>

          {/* Camera View */}
          <div className="glass-panel p-1 relative overflow-hidden">
            <div className="aspect-[4/3] bg-secondary/30 rounded-lg relative flex items-center justify-center overflow-hidden">
              {/* Error state */}
              {cameraError && mode === "camera" && (
                <div className="absolute inset-0 flex items-center justify-center z-20 p-6">
                  <Alert variant="destructive" className="max-w-sm">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="ml-2">{cameraError}</AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Live video feed */}
              <video
                ref={videoRef}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover rounded-lg mirror",
                  (!streaming || captured) && "hidden"
                )}
                muted
                playsInline
                style={{ transform: "scaleX(-1)" }}
              />

              {/* Captured photo canvas */}
              <canvas
                ref={canvasRef}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover rounded-lg",
                  !captured && "hidden"
                )}
                style={{ transform: "scaleX(-1)" }}
              />

              {/* Guide overlays (shown when streaming but not captured) */}
              {streaming && !captured && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-48 h-64 border-2 border-dashed border-primary/20 rounded-[50%]" />
                  </div>
                  <div className="absolute left-1/2 top-8 w-px h-6 bg-primary/10 z-10" />
                  <div className="absolute left-1/2 bottom-8 w-px h-6 bg-primary/10 z-10" />
                  <div className="absolute top-1/2 left-8 w-6 h-px bg-primary/10 z-10" />
                  <div className="absolute top-1/2 right-8 w-6 h-px bg-primary/10 z-10" />
                </>
              )}

              {/* Placeholder for non-camera modes */}
              {mode !== "camera" && !captured && (
                <div className="text-center space-y-3 z-10">
                  <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/15 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6 text-primary/40" />
                  </div>
                  <p className="text-sm text-muted-foreground">Drop an image or click to upload</p>
                </div>
              )}

              {/* Captured success overlay */}
              {captured && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20"
                >
                  <p className="text-xs font-medium text-primary">✓ Photo captured — ready for analysis</p>
                </motion.div>
              )}

              {/* Scan line animation */}
              {streaming && !captured && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                  <div
                    className="w-full h-px animate-scan-line"
                    style={{ background: "linear-gradient(90deg, transparent 0%, hsl(174 62% 47% / 0.15) 50%, transparent 100%)" }}
                  />
                </div>
              )}
            </div>

            {/* Bottom controls */}
            <div className="flex items-center justify-center gap-4 py-4">
              {!captured ? (
                <Button
                  size="lg"
                  className="px-8 glow-ring font-display"
                  onClick={capturePhoto}
                  disabled={mode === "camera" && !streaming}
                >
                  <Circle className="w-4 h-4 mr-2" />
                  Capture
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={retake}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake
                  </Button>
                  <Button
                    className="glow-ring font-display"
                    onClick={() => navigate("/app/insights")}
                  >
                    Analyze
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CaptureStudio;
