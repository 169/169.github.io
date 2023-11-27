import { Section } from 'astro-boilerplate-components';

import { AppConfig } from '@/utils/AppConfig';

type IFooterCopyrightProps = {
  site_name: string;
};

const FooterCopyright = (props: IFooterCopyrightProps) => (
  <div className="border-t border-gray-600 pt-5">
    <div className="text-sm text-gray-200">
      © Copyright {new Date().getFullYear()}. Built with ♥
      by{' '}
      <a
        className="text-cyan-400 hover:underline"
        href="https://github.com/169"
        target="_blank"
        rel="noopener noreferrer"
      >
        @169
      </a>
      .
    </div>
  </div>
);

const Footer = () => (
  <Section>
    <FooterCopyright />
  </Section>
);

export { Footer };
