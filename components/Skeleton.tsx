"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
  count?: number;
}

export default function Skeleton({
  className = "",
  variant = "text",
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseClasses =
    "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse";

  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "rounded-2xl",
  };

  const skeletonStyle = {
    width: width || (variant === "circular" ? "40px" : "100%"),
    height:
      height ||
      (variant === "text" ? "16px" : variant === "circular" ? "40px" : "200px"),
  };

  const skeletons = Array.from({ length: count }, (_, i) => (
    <motion.div
      key={i}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={skeletonStyle}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  ));

  return count === 1 ? (
    skeletons[0]
  ) : (
    <div className="space-y-3">{skeletons}</div>
  );
}

// Specialized skeleton components for common use cases
export function MemberCardSkeleton() {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
      <div className="flex flex-col items-center">
        <Skeleton
          variant="circular"
          width={120}
          height={120}
          className="mb-4"
        />
        <Skeleton variant="text" width="60%" height={24} className="mb-2" />
        <Skeleton variant="text" width="40%" height={16} className="mb-4" />
        <Skeleton variant="rectangular" width="100%" height={60} />
      </div>
    </div>
  );
}

export function GalleryCardSkeleton() {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        className="mb-4"
      />
      <div className="p-6">
        <Skeleton variant="text" width="80%" height={24} className="mb-3" />
        <Skeleton variant="text" width="100%" height={16} className="mb-2" />
        <Skeleton variant="text" width="90%" height={16} />
      </div>
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={200} height={24} />
      </div>
      <div className="flex gap-4">
        <Skeleton variant="text" width={80} height={20} />
        <Skeleton variant="text" width={80} height={20} />
        <Skeleton variant="text" width={80} height={20} />
      </div>
    </div>
  );
}
