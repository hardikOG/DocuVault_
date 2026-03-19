'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Shield,
  Upload,
  Clock,
  Bell,
  Cloud,
  Lock,
  Users,
  ArrowRight,
  Check
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button, Card } from '@/components/ui';
import { isAuthenticated } from '@/lib/auth';

const features = [
  {
    icon: Upload,
    title: 'Easy Upload',
    description: 'Drag and drop your documents securely. Support for PDF, images, and more.',
  },
  {
    icon: Clock,
    title: 'Expiry Tracking',
    description: 'Set expiration dates and never miss a renewal deadline again.',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Get notified before your documents expire via email alerts.',
  },
  {
    icon: Cloud,
    title: 'Cloud Storage',
    description: 'Access your documents anywhere, anytime. Securely stored in the cloud.',
  },
];

const trustBadges = [
  { icon: Lock, text: '256-bit Encrypted' },
  { icon: Clock, text: 'Smart Reminders' },
  { icon: Cloud, text: 'Cloud Backup' },
  { icon: Users, text: '10K+ Professionals' },
];

export default function LandingPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if authenticated and redirect
    if (isAuthenticated()) {
      router.push('/dashboard');
    } else {
      setIsReady(true);
    }
  }, [router]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 overflow-x-hidden relative flex flex-col w-full">
      <Navbar showAuthButtons />

      {/* Hero Section */}
      <section className="pt-36 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8 w-full flex-shrink-0">
        <div className="max-w-7xl mx-auto text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Secure Document Management
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Never Miss a{' '}
              <span className="gradient-text">Document Expiry</span>
              {' '}Again
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Store your important documents securely and get reminded before they expire.
              Perfect for passports, licenses, contracts, and more.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Get Started (Free)
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Login
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 flex flex-wrap justify-center gap-6 sm:gap-10"
          >
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
              >
                <badge.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 relative z-10 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Everything You Need
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features to keep your documents organized and never miss an expiry date.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover className="h-full text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 border-0 text-center py-12 sm:py-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Start Protecting Your Documents Today
            </h2>
            <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
              Join thousands of professionals who trust DocuVault to manage their important documents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-gray-100"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Create Free Account
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800 relative z-10 w-full mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-500" />
            <span className="font-semibold text-gray-900 dark:text-white">DocuVault</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} DocuVault. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
