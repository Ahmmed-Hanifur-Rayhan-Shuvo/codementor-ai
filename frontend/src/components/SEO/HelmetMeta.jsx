import { Helmet } from 'react-helmet-async';

const HelmetMeta = ({ 
  title = 'CodeMentor AI - AI-Powered Code Review',
  description = 'Analyze code in 20+ languages, detect security issues, and get AI-powered fixes instantly.',
  keywords = 'code review, AI, security, auto-fix, programming, software development',
  url = 'https://codementor-ai.vercel.app',
  image = 'https://codementor-ai.vercel.app/og-image.png',
  type = 'website'
}) => {
  const fullTitle = `${title} | CodeMentor AI`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default HelmetMeta;