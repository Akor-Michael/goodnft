document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".done");

  function validateForm(event) {
    event.preventDefault();

    var password = document.querySelector("#password").value;
    var passwordConfirm = document.querySelector("#passwordConfirm").value;

    if (password.length < 8) {
      errorMessage.textContent =
        "Password should be at least 8 characters long.";
      return false;
    }
    if (password !== passwordConfirm) {
      alert("Passwords do not match!");
      return false;
    }
    console.log("the password is now correct");
  }
  form.addEventListener("click", validateForm);
});
