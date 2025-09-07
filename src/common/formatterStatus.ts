const statusMap: Record<string, { label: string; color: string }> = {
  P: { label: "Pendente", color: "orange" },
  A: { label: "Aprovado", color: "green" },
  R: { label: "Reprovado", color: "red" },
};

export default statusMap;