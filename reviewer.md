# Code Review Standards

## Review Process

### Before Merging
1. **Automated Checks**: All tests must pass
2. **Code Coverage**: Minimum 80% coverage for new code
3. **Linting**: No ESLint errors or warnings
4. **Security Scan**: npm audit shows no critical vulnerabilities
5. **Manual Review**: At least 1 approval from team member

### Pull Request Template
```
## Description
Brief summary of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Enhancement
- [ ] Documentation
- [ ] Refactoring

## Changes Made
- Specific change 1
- Specific change 2

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guide
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

## Code Style Guide

### JavaScript/Node.js
- **Indentation**: 2 spaces
- **Quotes**: Double quotes for strings
- **Semicolons**: Required
- **Variable Names**: camelCase
- **Function Names**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Class Names**: PascalCase

### Naming Conventions
- `discoverKeywords()` - Action verbs for functions
- `isValid` - Boolean prefixes: is, has, should
- `createKeywordFromAPI()` - Descriptive, intent-clear
- `keyword_count` - Avoid underscores in JS

### Comments
- Comment "why", not "what"
- JSDoc for functions: parameter types, return type, example
- Inline comments for complex logic only
- Keep comments up-to-date with code changes

## Testing Standards

### Unit Tests
- **Framework**: Jest
- **Coverage**: Minimum 80%
- **Location**: `__tests__` folder alongside source
- **Naming**: `functionName.test.js`
- **Format**:
```javascript
describe('discoverKeywords', () => {
  it('should return array of keywords', () => {
    expect(result).toBeInstanceOf(Array);
  });
});
```

### Integration Tests
- **Scope**: Test full API endpoints
- **Database**: Use test database fixture
- **Cleanup**: Reset state after each test
- **Naming**: `api.integration.test.js`

### Test Coverage
- Functions: 100%
- Routes: 100%
- Error cases: All edge cases covered
- API responses: Both success and error states

## Performance Standards

### API Response Times
- GET endpoints: < 200ms
- POST endpoints: < 500ms
- Heavy operations (keyword discovery): < 30s

### Database Queries
- All queries use indexes
- N+1 queries eliminated
- Pagination for large result sets
- Query execution time logged

### Code Metrics
- Cyclomatic complexity: < 10
- Function length: < 50 lines
- File size: < 300 lines (split if larger)

## Security Review Checklist

- [ ] No hardcoded secrets or API keys
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS prevention (sanitize user input)
- [ ] CSRF protection (if applicable)
- [ ] Rate limiting implemented
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies checked for vulnerabilities

## Commit Message Standards

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Code style (no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvement
- **test**: Adding/updating tests
- **chore**: Build process, dependencies

### Example
```
feat(keywords): add keyword clustering algorithm

Implements K-means clustering to group related keywords
into semantic clusters. Improves keyword organization
and content planning efficiency.

Fixes #123
```

## Review Comments Template

### For Improvements
"Consider using [alternative] here because [reason]. This would [benefit]."

### For Required Changes
"This needs to be updated to [requirement] because [reason]."

### For Questions
"Can you explain why [code] is implemented this way? I'm concerned about [potential issue]."

