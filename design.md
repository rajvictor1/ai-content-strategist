# Design Guidelines

## UI/UX Philosophy

The AI Content Strategist follows a **data-first, developer-friendly** design approach:

- **Clarity**: Information is presented in clean, scannable layouts
- **Efficiency**: Minimal clicks to access key metrics and insights
- **Transparency**: All AI-generated content shows confidence scores and reasoning
- **Accessibility**: Color contrast ratios meet WCAG AA standards

## Color Palette

### Primary Colors
- **Primary Blue**: `#0066CC` - Actions, links, highlights
- **Success Green**: `#28A745` - Completed phases, positive metrics
- **Warning Orange**: `#FF9800` - Caution, review needed
- **Error Red**: `#DC3545` - Failures, urgent issues

### Neutral Colors
- **Background**: `#F8F9FA` - Main background
- **Surface**: `#FFFFFF` - Cards, panels
- **Text Primary**: `#212529` - Body text
- **Text Secondary**: `#6C757D` - Labels, captions

### Dark Mode
- **Background**: `#1E1E1E`
- **Surface**: `#2D2D2D`
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#B0B0B0`

## Typography

- **Font Family**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **Headings**: Semibold (600)
- **Body**: Regular (400)
- **Code**: Monospace (JetBrains Mono or Courier New)

### Size Scale
- H1: 32px / 1.5 line-height
- H2: 24px / 1.4 line-height
- Body: 14px / 1.6 line-height
- Caption: 12px / 1.5 line-height

## Component Specifications

### Buttons
- **Height**: 40px (standard), 32px (compact)
- **Padding**: 12px 24px
- **Border Radius**: 6px
- **States**: Default, Hover (+10% brightness), Active (-10% brightness), Disabled (40% opacity)

### Cards
- **Padding**: 16px
- **Border Radius**: 8px
- **Shadow**: 0px 2px 8px rgba(0,0,0,0.08)
- **Hover Shadow**: 0px 4px 16px rgba(0,0,0,0.12)

### Input Fields
- **Height**: 40px
- **Padding**: 12px 16px
- **Border**: 1px solid #CCCCCC
- **Border Radius**: 6px
- **Focus**: 2px solid primary blue outline

## Responsive Design

### Breakpoints
- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

### Principles
- Mobile-first approach
- Touch-friendly: Minimum 44px touch targets
- Flexible layouts using CSS Grid and Flexbox
- Images scale with max-width: 100%

## Data Visualization

- Use consistent color coding across all charts
- Provide both light and dark theme versions
- Include tooltips on hover for detailed information
- Support export to PNG/PDF for reports

## Accessibility

- All images have descriptive alt text
- Color is not the only way to convey information
- Keyboard navigation fully supported
- Screen reader friendly semantic HTML
- Sufficient color contrast: 4.5:1 for text, 3:1 for graphics

