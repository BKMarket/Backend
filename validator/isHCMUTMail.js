module.exports = (email) => {
  console.log(email);
  return (
    email.endsWith('@hcmut.edu.vn') && email.indexOf('@') === email.length - '@hcmut.edu.vn'.length
  );
};
