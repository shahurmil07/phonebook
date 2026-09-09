export const API_PREFIX = "/api";

export const contactRoutes = {
  list: `${API_PREFIX}/contacts`,
  byId: (id: string) => `${API_PREFIX}/contacts/${id}`,
  health: `${API_PREFIX}/health`,
} as const;
