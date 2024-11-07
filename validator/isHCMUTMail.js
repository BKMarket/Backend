module.exports = (email) => {
  return (
    email.endsWith('@hcmut.edu.vn') && email.indexOf('@') === email.length - '@hcmut.edu.vn'.length
  );
};
