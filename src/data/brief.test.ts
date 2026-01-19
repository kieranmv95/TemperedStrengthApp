import {
  getFeaturedArticle,
  getGlossaryByCategory,
  searchGlossary,
} from "./brief";

describe("brief data helpers", () => {
  it("returns the featured article", () => {
    const featured = getFeaturedArticle();

    expect(featured?.id).toBe("article_001");
    expect(featured?.isFeatured).toBe(true);
  });

  it("searches glossary by term and definition, case-insensitive", () => {
    const termResults = searchGlossary("amrap");
    const definitionResults = searchGlossary("delayed onset muscle");

    expect(termResults.some((term) => term.term === "AMRAP")).toBe(true);
    expect(definitionResults.some((term) => term.term === "DOMS")).toBe(true);
  });

  it("filters glossary by category", () => {
    const nutritionTerms = getGlossaryByCategory("Nutrition");

    expect(nutritionTerms.length).toBeGreaterThan(0);
    expect(
      nutritionTerms.every((term) => term.category === "Nutrition")
    ).toBe(true);
  });
});
