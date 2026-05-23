export function useColors(dark: boolean) {
  return {
    bg: dark ? 'bg-[#1C1C1C]' : 'bg-[#F8F7F4]',
    card: dark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-white border-[#E5E2DB]',
    text: dark ? 'text-white' : 'text-[#1C1C1C]',
    sub: dark ? 'text-gray-400' : 'text-[#6B6B6B]',
    input: dark ? 'bg-[#1C1C1C] border-[#3A3A3A] text-white placeholder-gray-600' : 'bg-white border-[#E5E2DB] text-[#1C1C1C] placeholder-gray-400',
    accent: 'text-[#1F4D3A]',
    accentBg: 'bg-[#1F4D3A]',
    gold: 'text-[#D4A017]',
    section: dark ? 'bg-[#232323]' : 'bg-white',
    sectionBorder: dark ? 'border-[#3A3A3A]' : 'border-[#E5E2DB]',
  };
}
