const Footer = () => {
  return (
    <footer className="w-full flex items-center bg-custom-default z-30 justify-center border-t border-zinc-200 dark:border-zinc-700 h-24">
      <p className="text-sm text-zinc-500 text-center">
        &copy; {new Date().getFullYear()} Hazim Bakar
        <br />
        All Rights Reserved
      </p>
    </footer>
  );
};
export default Footer;
