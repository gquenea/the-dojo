import "./Avatar.css";

type AvatarProps = {
  src: string;
};

export default function Avatar({ src }: AvatarProps) {
  return (
    <div className="avatar">
      <img src={src} alt="user avatar" />
    </div>
  );
}
