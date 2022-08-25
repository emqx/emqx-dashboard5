dev_branch=$1

echo sync code from $dev_branch

git pull origin enterprise --rebase
git pull origin $dev_branch --rebase
if [[ $(git status --porcelain) ]]; then
  echo '✗ resolve conflict please'
else
  git push origin enterprise -f
  echo '✔ sync code finished'
fi
