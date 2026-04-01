import { defineQuery } from 'next-sanity'

export const CASE_STUDIES_QUERY = defineQuery(`
  *[_type == "caseStudy"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    client,
    description,
    tags,
    coverImage {
      asset->{ _id, url, metadata { lqip, dimensions } },
      alt,
      hotspot,
      crop
    },
    color,
    shaderAngle,
    shaderOffsetX,
    shaderOffsetY,
    year,
    role,
    order
  }
`)

export const CASE_STUDY_SLUGS_QUERY = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current)] {
    "slug": slug.current
  }
`)

export const CASE_STUDY_QUERY = defineQuery(`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    client,
    description,
    tags,
    coverImage {
      asset->{ _id, url, metadata { lqip, dimensions } },
      alt,
      hotspot,
      crop
    },
    color,
    year,
    role,
    content
  }
`)
