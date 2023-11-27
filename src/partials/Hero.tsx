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
          src="/assets/images/icons/avatar.jpg"
          alt="Avatar image"
          loading="lazy"
        />
      }
      socialButtons={
        <>
          <a href="https://twitter.com/lin_bob57617">
            <HeroSocial
              src="/assets/images/icons/twitter-icon.svg"
              alt="Twitter icon"
            />
          </a>
          <a href="https://www.youtube.com/channel/UCyOTA3hgglp05Yw9JslvAaQ">
            <HeroSocial
              src="/assets/images/icons/youtube-icon.svg"
              alt="Youtube icon"
            />
          </a>
          <a href="https://space.bilibili.com/1082406125">
            <HeroSocial
              src="/assets/images/icons/bilibili-icon.svg"
              alt="Bilibili icon"
            />
          </a>
          <a href="https://github.com/169">
            <HeroSocial
              src="/assets/images/icons/github-icon.svg"
              alt="Github icon"
            />
          </a>
          <a href="https://www.reddit.com/user/lin_bob57617">
            <HeroSocial
              src="/assets/images/icons/reddit-icon.svg"
              alt="Reddit icon"
            />
          </a>
          <a href="https://stackoverflow.com/users/22993295/bob-lin">
            <HeroSocial
              src="/assets/images/icons/stackoverflow-icon.svg"
              alt="Stackoverflow icon"
            />
          </a>
        </>
      }
    />
  </Section>
);

export { Hero };
