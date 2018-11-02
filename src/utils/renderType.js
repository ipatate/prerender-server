// @flow

export const renderType = (
  renderTypeOptions: Array<string> = ['html', 'jpeg', 'png', 'pdf'],
): Function => (renderType: string = ''): string => {
  let type = 'html';
  if (renderTypeOptions.indexOf(renderType) > -1) {
    type = renderType;
  }
  return type;
};
