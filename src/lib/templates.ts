import classiquesData from "../../data/templates/vacances-classiques.json";
import plageData from "../../data/templates/vacances-plage.json";
import etrangerData from "../../data/templates/voyage-etranger.json";

export interface TemplateCategory {
  name: string;
  icon: string;
  items: string[];
}

export interface Template {
  id: string;
  name: string;
  categories: TemplateCategory[];
}

const templates: Template[] = [
  classiquesData as Template,
  plageData as Template,
  etrangerData as Template,
];

export function getTemplates(): Template[] {
  return templates;
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}
