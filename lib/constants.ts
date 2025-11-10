// Constants for the application
// This file centralizes magic numbers and repeated values for better maintainability

// ==========================================
// Time & Duration Constants
// ==========================================
export const DURATIONS = {
  NOTIFICATION_TIMEOUT: 5000, // 5 seconds
  ANIMATION_SHORT: 200, // 0.2 seconds
  ANIMATION_MEDIUM: 300, // 0.3 seconds
  ANIMATION_LONG: 600, // 0.6 seconds
  DEBOUNCE_DELAY: 300,
  MODAL_TRANSITION: 200,
} as const;

// ==========================================
// UI Constants
// ==========================================
export const UI = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILE_SIZE_MB: 5,
  PARTICLES_COUNT_DESKTOP: 20,
  PARTICLES_COUNT_MOBILE: 5,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
} as const;

// ==========================================
// Animation Variants
// ==========================================
export const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 },
  },
} as const;

// ==========================================
// Role Ranks (for member sorting)
// ==========================================
export const ROLE_RANKS: Record<string, number> = {
  owner: 1,
  "co-owner": 2,
  member: 3,
  bot: 999,
  default: 4,
} as const;

// ==========================================
// Error Messages
// ==========================================
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: "File quá lớn! Tối đa 5MB",
  UPLOAD_FAILED: "Tải lên thất bại. Vui lòng thử lại.",
  UPDATE_FAILED: "Cập nhật thất bại. Vui lòng thử lại.",
  PASSWORD_MISMATCH: "Mật khẩu không khớp!",
  GENERIC_ERROR: "Có lỗi xảy ra. Vui lòng thử lại.",
  LOGIN_REQUIRED: "Bạn cần đăng nhập để thực hiện thao tác này",
  NETWORK_ERROR: "Lỗi kết nối. Vui lòng kiểm tra internet.",
} as const;

// ==========================================
// Success Messages
// ==========================================
export const SUCCESS_MESSAGES = {
  UPDATE_SUCCESS: "Cập nhật thành công!",
  UPLOAD_SUCCESS: "Tải lên thành công!",
  SAVE_SUCCESS: "Lưu thành công!",
  DELETE_SUCCESS: "Xóa thành công!",
} as const;

// ==========================================
// Z-Index Layers
// ==========================================
export const Z_INDEX = {
  BACKGROUND: 0,
  CONTENT: 10,
  HEADER: 50,
  MODAL: 100,
  NOTIFICATION: 150,
  TOOLTIP: 200,
} as const;
