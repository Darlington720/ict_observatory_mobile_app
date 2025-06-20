import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { Download, FileText } from 'lucide-react-native';
import Button from './Button';
import { colors } from '@/constants/Colors';

interface PDFDownloadButtonProps {
  title: string;
  onDownload: () => Promise<void>;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  style?: any;
  disabled?: boolean;
}

export default function PDFDownloadButton({
  title,
  onDownload,
  variant = 'outline',
  size = 'medium',
  style,
  disabled = false
}: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (disabled || isGenerating) return;

    setIsGenerating(true);
    try {
      await onDownload();
      
      // Show platform-specific success message
      if (Platform.OS === 'web') {
        Alert.alert('Success', 'PDF has been downloaded to your Downloads folder.');
      } else {
        Alert.alert('Success', 'PDF has been generated and is ready to share.');
      }
    } catch (error) {
      console.error('PDF download error:', error);
      Alert.alert(
        'Download Error',
        error instanceof Error ? error.message : 'Failed to generate PDF. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      title={isGenerating ? 'Generating...' : title}
      onPress={handleDownload}
      variant={variant}
      size={size}
      loading={isGenerating}
      disabled={disabled || isGenerating}
      icon={
        isGenerating ? (
          <FileText size={size === 'small' ? 14 : 16} color={variant === 'outline' ? colors.primary : colors.card} />
        ) : (
          <Download size={size === 'small' ? 14 : 16} color={variant === 'outline' ? colors.primary : colors.card} />
        )
      }
      style={style}
    />
  );
}