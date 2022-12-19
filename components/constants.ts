const SOURCE_CODE_PRO_FONT =
  'https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,900&display=swap';

const INTER_FONT =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';

const OUTFIT_FONT =
  'https://fonts.googleapis.com/css2?family=Outfit:wght@500&display=swap';

const PHONE_NUMBER_MASK = [
  '(',
  /\d/u,
  /\d/u,
  /\d/u,
  ')',
  ' ',
  /\d/u,
  /\d/u,
  /\d/u,
  '-',
  /\d/u,
  /\d/u,
  /\d/u,
  /\d/u,
];

const SSN_MASK = [
  /\d/u,
  /\d/u,
  /\d/u,
  '-',
  /\d/u,
  /\d/u,
  '-',
  /\d/u,
  /\d/u,
  /\d/u,
  /\d/u,
];

export {
  SOURCE_CODE_PRO_FONT,
  INTER_FONT,
  OUTFIT_FONT,
  PHONE_NUMBER_MASK,
  SSN_MASK,
};
