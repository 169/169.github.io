import {
  GradientText,
  HeroAvatar,
  HeroSocial,
  Section,
} from 'astro-boilerplate-components';

const Hero = () => (
  <Section>
    <HeroAvatar
      title={
        <>
          Hi there, I'm <GradientText>Bob Lin</GradientText> 👋
        </>
      }
      description={
        <>
          Former PM turned programmer 🧑‍💻 | Proficient in Go, Python, and Rust 🚀
          | Making the tech world my new home 🏠 | Let's code and innovate
          together! 💡{' '}
          <a className="text-cyan-400 hover:underline" href="/">
            #AI
          </a>{' '}
          <a className="text-cyan-400 hover:underline" href="/">
            #GPT
          </a>{' '}
        </>
      }
      avatar={
        <img
          className="h-80 w-64"
          src="/assets/images/avatar.jpg"
          alt="Avatar image"
          loading="lazy"
        />
      }
      socialButtons={
        <>
          <a href="https://twitter.com/lin_bob57617">
            <HeroSocial
              src="/assets/images/twitter-icon.png"
              alt="Twitter icon"
            />
          </a>
          <a href="https://www.youtube.com/channel/UCyOTA3hgglp05Yw9JslvAaQ">
            <HeroSocial
              src="/assets/images/youtube-icon.png"
              alt="Youtube icon"
            />
          </a>
        </>
      }
    />
  </Section>
);

export { Hero };
