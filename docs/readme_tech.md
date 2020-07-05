# Liquido Mobile

Designed for small groups, e.g. social societeies, SMEs, pupils (suggest age >10), open source communities
Liquido Mobile has a uch simpler concept than the larger web based www.Liquido.vote

# Use Cases

### Directly open www.liquido.me on mobile

 * IF user has a stored JWT, then log him in. Goto User Home.
 * ELSE IF liquido.me/join/{teamname}?invitationCode={abc} link, then join that team
 * ELSE Welcome chat bot: User can decide to create a new team or join an existing one (with invitation code).

### Create a new team

 * Ask for username.
 * First user becomes admin for this team
 * Invite other users (e.g. pupils, members, people who are allowed to vote)
   * share a link
	 * share QR code
	 * share alphanumeric invitation code

### Join a team

 * Pre: USer clicked on invitation link or entered invitation code
 * Ask for username, then user joins team
   * Error if username or e-mail alreadey exists in that team
 * Goto User Home, where user can see proposals and open for voting polls

### Create a new poll

 1. Create a new poll with title (topic, theme)
 3. Every user in the team can add one(!) proposal to that poll
 4. Admin, eg. the teacher, starts the voting phase
 5. User's cast their vote
 6. Admin closes the voting phase
 7. Everyone can see the results.

# One tennant is one team

One Team contains:
 * one admin user
 * a list of team members (that are allowed to vote)
 * a list of polls
 * each poll with proposals (in elaboration, proposal, in voting, rule)


# Devlepment Roadmap

 * Local data store/cache for polls with proposals => liquido-store or VueApollo InMemoryStore

## Screenflow

On first app start: Chat like interface.

 * Hello, my name is Liquido. What's your name?
 * Hey <name>! Nice to meet you. What topic to you want to vote on? 
 * Ok. Now invite your friends so that they can join the poll.   <link> <QR-code>
 * <button>Go to poll

On next app starts

 * Hello <name> Welcome back to Liquido.
 * <userhome>
 * Bar at the bottom: proposals - polls - search


# Logging

## Logging on Mobile Device when developping

https://github.com/christlee1989/vue-mobile-log

# Debug

//TODO: Use Visual Studio Code   Chrome Debugger  with Vue
https://medium.com/@brockreece/how-i-stopped-using-console-log-when-debugging-vue-components-14e0f7aa280d

### Logging on mobile

TODO: Create a Vue Plugin that can show a loging component on mobile phone.

# Test

## Simulate test on mobile phone

Very nice mobile simulator: http://mobiletest.me/apple_iphone_6s/8028826 


# Furhter Links & Resources
