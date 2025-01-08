import { motion, AnimatePresence } from 'framer-motion';

// Notification Overlay Component
export const NotificationOverlay = ({ isVisible, onClose }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50"
      />
    )}
  </AnimatePresence>
);