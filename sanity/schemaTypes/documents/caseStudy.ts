import { defineType, defineField, defineArrayMember } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client Label',
      description: 'Shown in card header (lowercase style, e.g. "dixon ticonderoga")',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (rule) => rule.required().warning('Alt text is important for accessibility'),
        }),
      ],
    }),
    defineField({
      name: 'color',
      title: 'Card Accent Color',
      description: 'RGBA color for the electric gradient border on glass card (e.g. rgba(180,140,255,0.8))',
      type: 'string',
    }),
    defineField({
      name: 'shaderAngle',
      title: 'Shader Angle',
      description: 'Liquid metal shader rotation angle (0–360)',
      type: 'number',
    }),
    defineField({
      name: 'shaderOffsetX',
      title: 'Shader Offset X',
      description: 'Liquid metal horizontal offset (-1 to 1)',
      type: 'number',
    }),
    defineField({
      name: 'shaderOffsetY',
      title: 'Shader Offset Y',
      description: 'Liquid metal vertical offset (-1 to 1)',
      type: 'number',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      description: 'Controls card stacking order (0 = first/bottom)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'content',
      title: 'Case Study Body',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'client',
      media: 'coverImage',
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
