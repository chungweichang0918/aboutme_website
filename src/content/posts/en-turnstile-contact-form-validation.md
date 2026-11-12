---
contentId: "turnstile-contact-form-validation"
slug: "turnstile-contact-form-validation"
locale: "en"
title: "Validating and Delivering a Cloudflare Pages Contact Form"
summary: "This site’s contact form illustrates how to check the browser challenge, server verification, and email delivery."
date: "2026-11-12"
draft: false
visibility: "public"
tags: ["Cloudflare Pages","Turnstile","Resend"]
category: "Web Operations"
links: [{"label":"Cloudflare validation documentation","url":"https://developers.cloudflare.com/turnstile/get-started/server-side-validation/"}]
---

## Browser challenge and server verification

After the Turnstile widget returns a token, the browser sends it with the form to a Pages Function. The function calls Siteverify and checks the returned hostname and action before proceeding to email delivery.

## Find the failing stage

Check the production widget configuration, verify that the server accepted the token, then compare the mail provider’s response with the recipient’s inbox. Keep detailed diagnostics on the server and show a clear retry message to visitors.

## Test success and failure

Automated tests cover invalid fields, origin checks, rate limits, token verification, and email retries. A production smoke test uses a real form submission to confirm delivery.
