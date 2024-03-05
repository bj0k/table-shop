export type TemplateParam = {
  name: string;
  table: string;
};

export type TemplateBody = {
  template: string;
  params: TemplateParam[];
};
