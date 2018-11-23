// @flow
export const urlToRegex = (regex: RegExp = /([.?*+^$[\]\\(){}|-])/): RegExp =>
  new RegExp(regex, 'g'); // eslint-disable-line

// clean url for file name
export const cleanName = (regex: RegExp = /[./:-?{}()#*+\\|]/): RegExp =>
  new RegExp(regex, 'g'); // eslint-disable-line

// extension file
export const extensionRegex = (
  regex: RegExp = /\.(xml|less|png|jpg|jpeg|gif|pdf|doc|txt|ico|rss|zip|mp3|rar|exe|wmv|doc|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent|ttf|woff|woff2)$/, // prettier-ignore
): RegExp => new RegExp(regex);

// external request
export const tiersRegex = (
  regex: RegExp = /(googletagmanager|google-analytics|gstatic|googleapis|facebook|twitter|zopim)/,
): RegExp => new RegExp(regex);
