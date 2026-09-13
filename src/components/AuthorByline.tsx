import { DEFAULT_SITE_SETTINGS } from "../hooks/useFirebaseData";

interface AuthorBylineProps {
  author?: string;
  avatar?: string;
  editorialTitle?: string;
  className?: string;
  avatarSize?: number;
}

const AuthorByline = ({
  author,
  avatar,
  editorialTitle,
  className = "",
  avatarSize = 32,
}: AuthorBylineProps) => {
  const name = author || DEFAULT_SITE_SETTINGS.name || "Victor Chidera";
  const initial = (name || "V").charAt(0).toUpperCase();
  const size = { width: avatarSize, height: avatarSize };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          style={size}
          className="rounded-full object-cover border border-brand-line"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0.3";
          }}
        />
      ) : (
        <div
          style={size}
          className="rounded-full bg-brand-ink text-white flex items-center justify-center font-display font-bold"
        >
          {initial}
        </div>
      )}
      <div className="text-xs leading-tight">
        <p className="font-bold text-brand-ink">{name}</p>
        {editorialTitle && <p className="text-brand-muted">{editorialTitle}</p>}
      </div>
    </div>
  );
};

export default AuthorByline;