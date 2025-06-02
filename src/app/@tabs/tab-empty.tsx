type TabEmptyProps = {
  title: string;
  description: string;
};

export default function TabEmpty({ title, description }: TabEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
