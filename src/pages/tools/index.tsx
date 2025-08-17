import React from 'react';
import { ToolPage } from '../../components/ToolPage';
import { CaseConverter as CaseConverterTool } from './CaseConverter';
import { LoremIpsumGenerator as LoremIpsumGeneratorTool } from './LoremIpsumGenerator';
import { LetterCounter as LetterCounterTool } from './LetterCounter';
import { HandwritingGenerator as HandwritingGeneratorTool } from './HandwritingGenerator';
import { BionicTextConverter as BionicTextConverterTool } from './BionicTextConverter';
import { WhitespaceCleaner as WhitespaceCleanerTool } from './WhitespaceCleaner';
import { FontPairingFinder as FontPairingFinderTool } from './FontPairingFinder';
import { ImageTrimmer as ImageTrimmerTool } from './ImageTrimmer';
import { PhotoFilters as PhotoFiltersTool } from './PhotoFilters';
import { ImageResizer as ImageResizerTool } from './ImageResizer';
import { ImageColorExtractor as ImageColorExtractorTool } from './ImageColorExtractor';
import { CssLoaderGenerator as CssLoaderGeneratorTool } from './CssLoaderGenerator';
import { CssSwitchGenerator as CssSwitchGeneratorTool } from './CssSwitchGenerator';
import { CssCheckboxGenerator as CssCheckboxGeneratorTool } from './CssCheckboxGenerator';
import { CssClipPathGenerator as CssClipPathGeneratorTool } from './CssClipPathGenerator';
import { CssGlassmorphismGenerator as CssGlassmorphismGeneratorTool } from './CssGlassmorphismGenerator';
import { CodeToImageConverter as CodeToImageConverterTool } from './CodeToImageConverter';

// Text Tools
export const CaseConverter: React.FC = () => <CaseConverterTool />;
export const LoremIpsumGenerator: React.FC = () => <LoremIpsumGeneratorTool />;
export const LetterCounter: React.FC = () => <LetterCounterTool />;
export const TextToHandwritingConverter: React.FC = () => <HandwritingGeneratorTool />;
export const BionicReadingConverter: React.FC = () => <BionicTextConverterTool />;
export const MultipleWhitespaceRemover: React.FC = () => <WhitespaceCleanerTool />;
export const GoogleFontsPairFinder: React.FC = () => <FontPairingFinderTool />;

// Image Tools
export const ImageCropper: React.FC = () => <ImageTrimmerTool />;
export const ImageFilters: React.FC = () => <PhotoFiltersTool />;
export const ImageResizer: React.FC = () => <ImageResizerTool />;
export const ImageAverageColorFinder: React.FC = () => <ToolPage title="Average Color Detector" />;
export const ImageColorExtractor: React.FC = () => <ImageColorExtractorTool />;
export const ImageColorPicker: React.FC = () => <ToolPage title="Color Selector" />;

// CSS Tools
export const CssLoaderGenerator: React.FC = () => <CssLoaderGeneratorTool />;
export const CssCheckboxGenerator: React.FC = () => <CssCheckboxGeneratorTool />;
export const CssSwitchGenerator: React.FC = () => <CssSwitchGeneratorTool />;
export const CssClipPathGenerator: React.FC = () => <CssClipPathGeneratorTool />;
export const CssBackgroundPatternGenerator: React.FC = () => <ToolPage title="Background Pattern Maker" />;
export const CssCubicBezierGenerator: React.FC = () => <ToolPage title="Animation Curve Designer" />;
export const CssGlassmorphismGenerator: React.FC = () => <CssGlassmorphismGeneratorTool />;

// Developer Tools
export const CodeToImageConverter: React.FC = () => <CodeToImageConverterTool />;
export const UrlSlugGenerator: React.FC = () => <ToolPage title="SEO URL Creator" />;
export const ReactNativeShadowGenerator: React.FC = () => <ToolPage title="React Native Shadow Creator" />;
export const Base64EncoderDecoder: React.FC = () => <ToolPage title="Base64 Converter" />;
export const HtmlEncoderDecoder: React.FC = () => <ToolPage title="HTML Encoder/Decoder" />;
export const UrlEncoderDecoder: React.FC = () => <ToolPage title="URL Encoder/Decoder" />;

// Social Media Tools
export const InstagramFilters: React.FC = () => <ToolPage title="Instagram Filter Effects" />;
export const InstagramPostGenerator: React.FC = () => <ToolPage title="Instagram Post Creator" />;
export const InstagramPhotoDownloader: React.FC = () => <ToolPage title="Instagram Image Downloader" />;
export const TweetGenerator: React.FC = () => <ToolPage title="Twitter Post Creator" />;
export const TweetToImageConverter: React.FC = () => <ToolPage title="Tweet Image Generator" />;
export const TwitterAdRevenueGenerator: React.FC = () => <ToolPage title="Twitter Ad Earnings Calculator" />;

// Miscellaneous Tools
export const StrongRandomPasswordGenerator: React.FC = () => <ToolPage title="Secure Password Creator" />;
export const ListRandomizer: React.FC = () => <ToolPage title="Item Shuffler" />;
export const QrCodeGenerator: React.FC = () => <ToolPage title="QR Code Creator" />;
export const BarcodeGenerator: React.FC = () => <ToolPage title="Barcode Maker" />;
export const FakeIbanGenerator: React.FC = () => <ToolPage title="Mock IBAN Generator" />;