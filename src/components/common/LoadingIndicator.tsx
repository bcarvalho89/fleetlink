const LoadingIndicator = ({
  text = 'Loading Indicator',
}: {
  text?: string;
}) => {
  return (
    <div>
      <p>{text}</p>
    </div>
  );
};

export default LoadingIndicator;
