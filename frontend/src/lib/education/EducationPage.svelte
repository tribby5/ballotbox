<script lang="ts">
  import SiteHeader from '$lib/layout/SiteHeader.svelte';
  import ComparisonTable from './ComparisonTable.svelte';
  import MethodSectionCard from './MethodSectionCard.svelte';
  import EducationCriteriaSection from './EducationCriteriaSection.svelte';
  import EducationHero from './EducationHero.svelte';
  import EducationIntroSection from './EducationIntroSection.svelte';
  import EducationFurtherReading from './EducationFurtherReading.svelte';
  import {
    heroTitle,
    heroSubtitle,
    introTitle,
    introParagraphs,
    methodSections,
    criteriaBlocks,
    comparisonRows,
    furtherReadingTitle,
    furtherReadingBullets,
  } from '$lib/education/educationContent';
</script>

<SiteHeader methodsPage />

<div class="bb-page">
  <div class="bb-page-inner bb-page-inner--education">
    <EducationHero title={heroTitle} subtitle={heroSubtitle} />
    <EducationIntroSection title={introTitle} paragraphs={introParagraphs} />

    <div class="method-stack">
      {#each methodSections as section (section.title)}
        <MethodSectionCard {section} />
      {/each}
    </div>

    <EducationCriteriaSection blocks={criteriaBlocks} />
    <ComparisonTable rows={comparisonRows} />
    <EducationFurtherReading title={furtherReadingTitle} bullets={furtherReadingBullets} />
  </div>
</div>

<style>
  .method-stack {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
</style>
