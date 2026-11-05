import banners from './ascii-banners.generated.json';

// Pure 7-bit ASCII only: pixel fonts ship no box-drawing glyphs, so anything else would fall back to a mismatched font.
export const BANNERS = banners as Record<'logo' | 'projects' | 'cliTools' | 'contributions' | 'notFound', string>;

export const TUX = String.raw`    .--.
   |o_o |
   |:_/ |
  //   \ \
 (|     | )
/'\_   _/` + '`' + String.raw`\
\___)=(___/`;

export const ICONS: Record<'projects' | 'cliTools' | 'contributions' | 'contact', string> = {
  projects: String.raw` ____
/    \___
|________|`,
  cliTools: String.raw` _______
|>_     |
|_______|`,
  contributions: String.raw`o---o
  \
   o---o`,
  contact: String.raw` _______
|\     /|
|_\___/_|`,
};
