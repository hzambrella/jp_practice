read -p "input commit measure:"  val
echo $val
git status
git add .
git commit -m "$val"
git push origin master
