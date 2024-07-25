#!/usr/bin/env sh

YELLOW="$(tput setaf 3)"
CYAN="$(tput setaf 6)"
NC="$(tput sgr0)" # No Color

# Usage: changed <file_name>
changed() {
  git diff --name-only HEAD@{1} HEAD | grep "^$1" >/dev/null 2>&1
}

# Usage: check_file <file_name> [...<messages>]
check_file() {
  FILE="$1"
  shift

  if ! changed "$FILE"; then return; fi

  WIDTH="0"
  for line in "$@"; do
    if [ "${#line}" -gt "$WIDTH" ]; then WIDTH="${#line}"; fi
  done

  LINE1="📦  ${CYAN}${FILE}${NC} has changed."
  L1_COLOR_LEN=$((${#CYAN} + ${#NC}))
  L1_OFFSET=$((2 + $L1_COLOR_LEN))        # +2 to offset pad consumption of 📦
  LEN1=$((${#LINE1} + 1 - $L1_COLOR_LEN)) # +1 to offset display of 📦
  if [ "$LEN1" -gt "$WIDTH" ]; then WIDTH="$LEN1"; fi

  MARK="#"
  MARK_LINE=$(printf "%*s" "$((WIDTH + 8))" | sed "s/ /${MARK}/g")
  EMPTY_LINE=$(printf "${MARK}   %-${WIDTH}s   ${MARK}" "")

  echo ""
  echo "${YELLOW}${MARK_LINE}"
  echo "$EMPTY_LINE"
  printf "${MARK}   %-$((${WIDTH} + ${L1_OFFSET}))s   ${YELLOW}${MARK}\n" "$LINE1"
  for line in "$@"; do
    printf "${MARK}   ${NC}%-${WIDTH}s   ${YELLOW}${MARK}\n" "$line"
  done
  echo "$EMPTY_LINE"
  echo "${MARK_LINE}${NC}"
  echo ""
}

check_file "package-lock.json" "Run 'npm install' to update your dependencies."

exit 0
