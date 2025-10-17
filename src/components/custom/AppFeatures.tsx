import { Check } from "lucide-react";

const AppFeatures = () => {
  return (
    <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative z-10">
      <div className="relative z-10 text-white text-center space-y-6 max-w-lg backdrop-blur-xl bg-white/10 p-10 rounded-3xl border border-white/20 shadow-2xl">
        <h2 className="text-white mb-4">Start your journey today</h2>
        <p className="text-white/90 text-lg">
          Join thousands of users who are already enjoying seamless
          communication.
        </p>
        <div className="space-y-4 pt-8">
          {[
            "End-to-end encrypted messages",
            "HD audio and video calls",
            "Share files and media instantly",
            "Available on all your devices",
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-left backdrop-blur-sm bg-white/5 p-3 rounded-xl border border-white/10"
            >
              <div className="w-8 h-8 bg-yellow-400/30 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 border border-white/20">
                <Check className="w-5 h-5 text-white" />
              </div>
              <p className="text-white/90">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppFeatures;
