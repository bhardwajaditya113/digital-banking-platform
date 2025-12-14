# Page snapshot

```yaml
- generic [ref=e10]:
  - generic [ref=e11]:
    - img [ref=e13]
    - heading "Welcome Back" [level=2] [ref=e15]
    - paragraph [ref=e16]: Sign in to your account to continue
  - generic [ref=e17]:
    - generic [ref=e19]:
      - generic [ref=e20]:
        - img [ref=e21]
        - text: Email Address
      - textbox "Enter your email" [active] [ref=e23]
    - generic [ref=e25]:
      - generic [ref=e26]:
        - img [ref=e27]
        - text: Password
      - textbox "Enter your password" [ref=e29]
    - button "Sign In" [ref=e31] [cursor=pointer]:
      - img [ref=e32]
      - text: Sign In
  - paragraph [ref=e35]:
    - text: Don't have an account?
    - link "Sign up here" [ref=e36] [cursor=pointer]:
      - /url: /register
```