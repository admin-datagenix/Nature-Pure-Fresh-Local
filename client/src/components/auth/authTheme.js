/** Soft sage + warm cream — shared login & register theme */
export const AUTH = {
  darkGreen: '#294633',
  green: '#3D6049',
  sage: '#DDE7DC',
  lightSage: '#EEF2EA',
  cream: '#F7F5EF',
  white: '#FFFFFF',
  muted: '#7C8A80',
};

export const authPage =
  "auth-page font-['Nunito',system-ui,sans-serif] h-screen min-h-screen overflow-hidden bg-[#F7F5EF] text-[#294633]";

export const authCard =
  'w-full max-w-[460px] rounded-[32px] bg-white/90 px-8 py-9 shadow-[0_20px_50px_rgba(41,70,51,0.08),0_4px_16px_rgba(41,70,51,0.04)] backdrop-blur-sm sm:px-10 sm:py-11';

export const authCardCompact =
  'auth-compact w-full max-w-[460px] rounded-[28px] bg-white/90 px-6 py-5 shadow-[0_20px_50px_rgba(41,70,51,0.08),0_4px_16px_rgba(41,70,51,0.04)] backdrop-blur-sm sm:px-8 sm:py-6';

/** Light, modern neumorphism — inset sage + cream highlight */
export const authInput =
  'auth-clay-input h-[58px] w-full rounded-[6px] border-0 bg-[#EEF2EA] text-[0.9375rem] font-normal text-[#294633] placeholder:text-[#7C8A80] shadow-[inset_3px_3px_8px_rgba(61,96,73,0.07),inset_-2px_-2px_6px_rgba(255,255,255,0.92)] outline-none transition duration-200 focus:bg-[#F7F5EF] focus:shadow-[inset_2px_2px_6px_rgba(61,96,73,0.08),0_0_0_3px_rgba(221,231,220,0.9)]';

export const authFieldIcon = 'text-[#3D6049]/70';

export const authFieldWrap = 'relative';

export const authButton =
  'mt-2 h-[58px] w-full rounded-full bg-[#294633] text-[0.9375rem] font-semibold tracking-wide text-white shadow-[0_10px_24px_rgba(41,70,51,0.22)] transition duration-200 hover:bg-[#3D6049] hover:shadow-[0_12px_28px_rgba(41,70,51,0.26)] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100';

export const authToggleTrack =
  'mb-7 flex h-[52px] rounded-full bg-[#EEF2EA] p-1 shadow-[inset_2px_2px_6px_rgba(61,96,73,0.06),inset_-1px_-1px_4px_rgba(255,255,255,0.9)]';

export const authToggleTrackCompact =
  'mb-3.5 flex h-10 rounded-full bg-[#EEF2EA] p-1 shadow-[inset_2px_2px_6px_rgba(61,96,73,0.06),inset_-1px_-1px_4px_rgba(255,255,255,0.9)]';

export const authToggleActive =
  'bg-white text-[#294633] shadow-[0_2px_8px_rgba(41,70,51,0.08)]';

export const authToggleInactive =
  'text-[#7C8A80] hover:text-[#3D6049]';

export const authFormStack = 'space-y-4';

export const authFormStackCompact = 'space-y-2.5';

/** @deprecated */
export const clayCard = authCard;
export const clayInput = authInput;
export const clayButton = authButton;
