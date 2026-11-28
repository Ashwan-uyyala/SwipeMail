# API Design

The current Gmail read path uses the Google provider token in the Supabase Auth session with the `gmail.readonly` scope. `gmailService` requests the first 100 mailbox message IDs and label names, then fetches each message's full payload from the Gmail REST API in small batches. The browser maps Gmail headers, labels, snippet, and MIME body into the swipe-card email model; message HTML is converted to text rather than rendered as active markup.

Gmail mutations, synchronization, and AI summaries remain future work for Supabase Edge Functions. Do not persist or log provider tokens or message contents.
