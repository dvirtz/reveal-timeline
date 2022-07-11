export function uniqueId(deck: RevealStatic, slide?: Element) {
  const { h, v } = deck.getIndices(slide);
  return `slide_${h}` + (v ? `_${v}` : '');
}

export function indices(unique_id: string) {
  const parts = unique_id.split('_');
  return {
    h: Number(parts[1]),
    v: parts.length > 2 ? Number(parts[2]) : undefined
  };
}
