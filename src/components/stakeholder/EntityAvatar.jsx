const avatarStyles = {
  PT: 'bg-[rgba(0,69,54,0.10)] text-[#004536]',
  UD: 'bg-[rgba(0,108,73,0.10)] text-[#006C49]',
  CV: 'bg-[rgba(103,79,29,0.10)] text-[#FFDEA4]',
}

export default function EntityAvatar({ type }) {
  const style = avatarStyles[type] ?? avatarStyles.PT

  return (
    <span
      className={[
        'inline-flex items-center justify-center min-w-[28px] h-8 px-1.5 rounded',
        'text-xs font-bold shrink-0 transition-transform duration-150 hover:scale-110',
        style,
      ].join(' ')}
    >
      {type}
    </span>
  )
}
