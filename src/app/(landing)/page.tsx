import { BeyondJourneyButton } from '@/components/beyond-journey-button';
import { DiscordMessage } from '@/components/discord-message';
import { Heading } from '@/components/heading';
import { Icons } from '@/components/icons';
import { AnimatedList } from '@/components/magicui/animated-list';
import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { MockDiscordUI } from '@/components/mock-discord-ui';
import { Notification } from '@/components/notification';
import { codeSnippet } from '@/helper/code-snippet';
import {
  BarChartIcon,
  BellIcon,
  CodeIcon,
  ListBulletIcon,
} from '@radix-ui/react-icons';
import { Check, Star, XIcon } from 'lucide-react';
import Image from 'next/image';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Page = () => {
  return (
    <>
      <section className="relative py-24 sm:py-32 bg-brand-ghost">
        <MaxWidthWrapper className="text-center">
          <div className="relative mx-auto text-center flex flex-col items-center gap-10">
            <div>
              <Heading>
                <span>Real-Time SaaS Insights,</span>
                <br />
                <span className="relative bg-gradient-to-r from-[#36a18b] to-[#00754a] text-transparent bg-clip-text">
                  Delivered Seamlessly to Discord.
                </span>
              </Heading>
            </div>
            <p className="text-xl/7 text-gray-600 max-w-prose text-center text-pretty">
              Frinora makes monitoring your SaaS effortless. Receive instant
              notifications for{' '}
              <span className="font-semibold text-gray-700">
                sales, new users, and any key event
              </span>
              —delivered straight to your Discord.
            </p>
            <ul className="space-y-2 text-base/7 text-gray-600 text-left flex flex-col items-start">
              {[
                'Real-time Discord alerts for critical events',
                'Track sales, new users, or any other event',
                'Get notified the moment someone reaches out to hire you',
                'Receive instant alerts for user-reported issues',
              ].map((item, index) => (
                <li key={index} className="flex gap-1.5 items-center text-left">
                  <Check className="text-[#02a68b] size-5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="w-full max-w-80">
              <BeyondJourneyButton
                href="/sign-up"
                className="relative z-10 h-14 w-full text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                Get Instant Alerts
              </BeyondJourneyButton>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
      <section className="relative bg-brand-ghost pb-4">
        <div className="absolute inset-x-0 bottom-24 top-24 bg-brand-indigo" />
        <div className="relative mx-auto">
          <MaxWidthWrapper className="relative">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <MockDiscordUI>
                <AnimatedList>
                  <DiscordMessage
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="Frinora Avatar"
                    username="Frinora"
                    timestamp="Todat at 1:44PM"
                    badgeText="SignUp"
                    badgeColor="#43b581"
                    title="👤 New user signed up"
                    content={{
                      name: 'Mikasa',
                      email: 'mikasa@email.com',
                    }}
                  />
                  <DiscordMessage
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="Frinora Avatar"
                    username="Frinora"
                    timestamp="Todat at 2:35PM"
                    badgeText="Revenue"
                    badgeColor="#faa61a"
                    title="💰 Payment received"
                    content={{
                      amount: '$49.00',
                      email: 'zeke.wonder@email.com',
                      plan: 'PRO',
                    }}
                  />
                  <DiscordMessage
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="Frinora Avatar"
                    username="Frinora"
                    timestamp="Todat at 3:00PM"
                    badgeText="Milestone"
                    badgeColor="#5865f2"
                    title="🚀 Revenue Milestone Achieved"
                    content={{
                      recurringRevenue: '$5,000 USD',
                      growth: '+8.2%',
                    }}
                  />
                </AnimatedList>
              </MockDiscordUI>
            </div>
          </MaxWidthWrapper>
        </div>
      </section>
      <section className="relative py-24 sm:py-32 bg-[#fff]">
        <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-20">
          <div>
            <h2 className="text-center text-base/7 font-semibold text-[#007782]">
              Intuitive Monitoring
            </h2>
            <Heading>Stay ahead with real-time insights</Heading>
          </div>

          <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
            {/* first bento grid element */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-[#fff] lg:rounded-l-[2rem]" />

              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                  <div className="max-lg:text-center">
                    <BellIcon
                      className="size-7
                     inline-block"
                    />
                  </div>
                  <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-void max-lg:text-center">
                    Real-time notifications
                  </p>
                  <p className="mt-2 max-w-lg text-md/6 text-gray-600 max-lg:text-center">
                    Get notified about critical events the moment they happen,
                    no matter if you&apos;re at home or on the go.
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto  max-lg:max-w-sm">
                  <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[10cqw] border-x-[2cqw] border-t-[2cqw] border-gray-700 pt-3 bg-gray-900 shadow-2xl px-2">
                    <div className="flex items-center justify-center">
                      <span className="w-16 rounded-xl h-4 bg-gray-700" />
                    </div>
                    <AnimatedList>
                      {[...Array(5)].map((_, i) => (
                        <Notification key={i} />
                      ))}
                    </AnimatedList>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg ring-1 ring-[#f0f0f0] lg:rounded-l-[2rem]" />
            </div>
            {/* second bento grid element */}
            <div className="relative max-lg:row-start-1">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg+1px))] max-lg:rounded-t-[calc(2rem+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <div className="max-lg:text-center">
                    <BarChartIcon className="size-7 inline-block" />
                  </div>
                  <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-void max-lg:text-center">
                    Track Any Event
                  </p>
                  <p className="mt-2 max-w-lg text-md/6 text-gray-600 max-lg:text-center">
                    From new user signups to sucessful payments, Frinora
                    notifies you for all critical events in your SaaS.
                  </p>
                </div>
                <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                  <Image
                    className="w-full max-lg:max-w-xs"
                    src="/bento-any-event.png"
                    alt="Bento box illustrating event tracking"
                    height={500}
                    width={300}
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg ring-1 ring-[#f0f0f0] max-lg:rounded-t-[2rem]" />
            </div>

            {/* third bento grid element */}
            <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
              <div className="absolute inset-px rounded-lg bg-white" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg+1px))]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <div className="max-lg:text-center">
                    <ListBulletIcon
                      className="size-7
                     inline-block"
                    />
                  </div>
                  <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-void max-lg:text-center">
                    Track Any Properties
                  </p>
                  <p className="mt-2 max-w-lg text-md/6 text-gray-600 max-lg:text-center">
                    Add any custom data you like to an event, such as a user
                    email, a purchase amount or an exceeded quota.
                  </p>
                </div>
                <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                  <Image
                    className="w-full max-lg:max-w-xs"
                    src="/bento-custom-data.png"
                    alt="Bento box illustrating custom tracking"
                    height={500}
                    width={300}
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg ring-1 ring-[#f0f0f0]" />
            </div>

            {/* fourth bento grid element */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />
              <div className="relative flex flex-col h-full overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                  <div className="max-lg:text-center">
                    <CodeIcon
                      className="size-7
                     inline-block"
                    />
                  </div>
                  <p className="mt-2 text-lg/7 font-medium tracking-tight text-brand-void max-lg:text-center">
                    Easy Integration
                  </p>
                  <p className="mt-2 max-w-lg text-md/6 text-gray-600 max-lg:text-center">
                    Connect Finora with your existing workflows in minutes and
                    call our intuitive logging API from any language.
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow">
                  <div className="absolute bottom-0 left-10 right-0 top-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                    <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                      <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                        <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                          <span className="inline-flex items-center gap-3">
                            frinora.js
                            <span className="hover:bg-gray-400/40 cursor-pointer rounded p-1 duration-200">
                              <XIcon className="size-3" />
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-hidden">
                      <div className="max-h-[30rem]">
                        <SyntaxHighlighter
                          language="typescript"
                          style={{
                            ...oneDark,
                            'pre[class*="language-"]': {
                              ...oneDark['pre[class*="language-"]'],
                              background: 'transparent',
                              overflow: 'hidden',
                            },
                            'code[class*="language-"]': {
                              ...oneDark['code[class*="language-"]'],
                              background: 'transparent',
                            },
                          }}
                        >
                          {codeSnippet}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg ring-1 ring-[#f0f0f0] max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
      <section className="relative py-24 sm:py-32 bg-white">
        <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-20">
          <div>
            <h2 className="text-center text-base/7 font-semibold text-[#007782]">
              Real-World Experiences
            </h2>
            <Heading>What our users are saying.</Heading>
          </div>
          <div className="mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {/* first customer review */}
            <div className="flex flex-auto flex-col gap-4 bg-[#f9f3f0] p-6 sm:p-8 lg:p-16 rounded-t-[2rem] lg:rounded-tr-none lg:rounded-l-[2rem]">
              <div className="flex gap-0.5 mb-2 justify-center lg:justify-start">
                <Star className="size-5 text-[#00615f] fill-[#00615f]" />
                <Star className="size-5 text-[#00615f] fill-[#00615f]" />
                <Star className="size-5 text-[#00615f] fill-[#00615f]" />
                <Star className="size-5 text-[#00615f] fill-[#00615f]" />
                <Star className="size-5 text-[#00615f] fill-[#00615f]" />
                {/* <Star className="size-5 text-brand-deep fill-brand-deep" />
                <Star className="size-5 text-brand-deep fill-brand-deep" />
                <Star className="size-5 text-brand-deep fill-brand-deep" />
                <Star className="size-5 text-brand-deep fill-brand-deep" />
                <Star className="size-5 text-brand-deep fill-brand-deep" /> */}
              </div>

              <p className="text-base sm:text-lg lg:text-lg/8 font-medium tracking-tight text-brand-void text-center lg:text-left text-pretty">
                Frinora has been a game-changer for me. I&apos;ve been using it
                for two months now and seeing sales pop up in real-time is super
                satisfying.
              </p>
              <div className="flex flex-col justify-center lg:justify-start sm:flex-row items-center sm:items-start gap-4 mt-2">
                <Image
                  src="/user-2.png"
                  className="rounded-full object-cover"
                  alt="Kat Bellucci"
                  height={48}
                  width={48}
                />
                <div className="flex flex-col items-center sm:items-start">
                  <p className="font-semibold flex items-center">
                    Kat Bellucci
                    <Icons.verificationBadge className="size-4 inline-block ml-1.5" />
                  </p>
                  <p className="text-sm text-gray-600">@kat</p>
                </div>
              </div>
            </div>

            {/* second customer review */}
            <div className="flex flex-auto flex-col gap-4 bg-[#f9f3f0] p-6 sm:p-8 lg:p-16 rounded-b-[2rem] lg:rounded-bl-none lg:rounded-r-[2rem]">
              <div className="flex gap-0.5 mb-2 justify-center lg:justify-start">
                <Star className="size-5 text-[#00615f] fill-[#00615f]" />
                <Star className="size-5 text-[#00615f] fill-[#00615f]" />
                <Star className="size-5 text-[#00615f] fill-[#00615f]" />
                <Star className="size-5 text-[#00615f] fill-[#00615f]" />
                <Star className="size-5 text-[#00615f] fill-[#00615f]" />
                <Star className="size-5 text-[#00615f] fill-[#00615f]" />
                {/* <Star className="size-5 text-brand-deep fill-brand-deep" />
                <Star className="size-5 text-brand-deep fill-brand-deep" />
                <Star className="size-5 text-brand-deep fill-brand-deep" />
                <Star className="size-5 text-brand-deep fill-brand-deep" /> */}
              </div>

              <p className="text-base sm:text-lg lg:text-lg/8 font-medium tracking-tight text-brand-void text-center lg:text-left text-pretty">
                Frinora&apos;s been paying off for our SaaS. Nice to have simple
                way to see how we&apos;re doing day-to-day. Definitely makes our
                lives easier.
              </p>
              <div className="flex flex-col justify-center lg:justify-start sm:flex-row items-center sm:items-start gap-4 mt-2">
                <Image
                  src="/user-1.png"
                  className="rounded-full object-cover"
                  alt="Kat Bellucci"
                  height={48}
                  width={48}
                />
                <div className="flex flex-col items-center sm:items-start">
                  <p className="font-semibold flex items-center">
                    El Carpenter
                    <Icons.verificationBadge className="size-4 inline-block ml-1.5" />
                  </p>
                  <p className="text-sm text-gray-600">@el</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mx-auto text-center flex flex-col items-center gap-10">
            <Heading>
              Real-time alerts. Right where your team lives — on Discord.
            </Heading>
          </div>
          <BeyondJourneyButton
            href="/sign-up"
            className="relative z-10 h-14 w-full max-w-xs text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
          >
            Get Instant Alerts
          </BeyondJourneyButton>
        </MaxWidthWrapper>
      </section>
    </>
  );
};

export default Page;
