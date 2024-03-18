# Contribution Guide

This guide will explain how to contribute to the project, with all the intricacies etc.

## Create a Branch

First you will need to create your own branch to make your commits off of.

You can do this via the command line, however, I find it more simple and less confusing to do it via Github.

First click on issues, create new issue, and title the issue with what you are adding. You can add tags as appropriate.

Assign yourself and anyone else applicable to the issue.

Then, when issue is created you should see create a branch under development on the right hand side. Following along you create a branch that is then linked to that issue.

Personally I like to name the branch issue/{the auto generated text github does based off title}

Once your branch is created, go to your code.


## Committing and Editing Your Branch

### Editing the Custom Branch

First, you need to be on your branch. The easiest way to do is via
```bash
git switch {branch name}
```

You may have to a git pull first so it recognizes the branch was created.

This links the branch automatically to the one you just created on github.

If you are ever unsure of what branch you are on, run
```bash
git status
```

Which shows you what files, are added, committed, etc along with what branch you are on.

MAKE SURE you are not on the main branch.

### Pushing Changes to Branch

Once you have edited the and made a few changes, it may be time to commit.

Ideally, it is best practice to make a few small changes and commit more often then one large change and commit as point of version control is to rollback if need be.

But, regardless, once changes have been made, run git status command.

This shows files (in red usually) which files are not being track or have been modified. You can add them individually (which is recommended to avoid pushing something or committing something you shouldn't) via git add

```bash
git add {file_name}
```

You can also do git add . to add everything.

Once added, they are no ready to be committed. To commit, run 
```bash
git commit
```

If you have a file editor already configured in your git config it will open up and let you type in a message. Usually the first line is the title, and then the rest is the message.

Try to keep title short and concise as limited amount of space for it.

Same with the message but the message should be detailed enough to explain what you committed.

You can use git commit -m "{message}" but that might lead to shorter less detailed or unhelpful messages sometimes so may not be ideal.

Once your changes are committed you can do git status to see which files you are about to commit and then run

```bash
git push
```

which pushes your changes to your branch.