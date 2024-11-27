const verified = `
<!DOCTYPE html>
<html>

<head>
    <title>Email Verification Success</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
        }

        .success-animation {
            animation: fade-in 1s;
        }

        @keyframes fade-in {
            0% {
                opacity: 0;
            }

            100% {
                opacity: 1;
            }
        }

        svg {
            width: 100px;
            height: 100px;
            margin-top: 70px;
        }

        @media only screen and (max-width: 480px) {
            svg {
                width: 80px;
                height: 80px;
            }
        }
    </style>
</head>

<body><svg class="success-animation" viewBox="0 0 24 24">
        <path fill="blue" d="M0 11l2-2 5 5L18 3l2 2L7 18z"></path>
    </svg>
    <h1 class="success-animation">Reset Password Successful!</h1>
    <p class="success-animation">Your new password has been successfully created.</p>
</body>

</html>`;

const expired = `
<!DOCTYPE html>
<html>

<head>
    <title>Invalid Token</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
        }

        .error-animation {
            animation: shake 0.5s;
        }

        @keyframes shake {
            0% {
                transform: translateX(0);
            }

            20% {
                transform: translateX(-5px);
            }

            40% {
                transform: translateX(5px);
            }

            60% {
                transform: translateX(-5px);
            }

            80% {
                transform: translateX(5px);
            }

            100% {
                transform: translateX(0);
            }
        }

        svg {
            width: 100px;
            height: 100px;
            fill: red;
            margin-top: 70px;
        }

        @media only screen and (max-width: 480px) {
            svg {
                width: 80px;
                height: 80px;
            }
        }
    </style>
</head>

<body><svg class="error-animation" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v6h-2zm0 8h2v2h-2z"></path>
    </svg>
    <h1 class="error-animation">Expired Reset link</h1>
    <p class="error-animation">This reset password link has expired create a new link.</p>
</body>

</html>`;

document.addEventListener("DOMContentLoaded", function () {
  const url = document.getElementById("url").dataset.url;
  const token = document.getElementById("token").dataset.token;

  const form = document.querySelector(".done");
  const errorMessage = document.querySelector("#error-message");

  //   console.log("yes its working");

  function validateForm(event) {
    event.preventDefault();

    const password = document.querySelector("#password").value;
    const passwordConfirm = document.querySelector("#passwordConfirm").value;

    if (password.length < 8) {
      errorMessage.textContent =
        "Password should be at least 8 characters long.";
      return false;
    }
    if (password !== passwordConfirm) {
      errorMessage.textContent = "Passwords do not match!";
      return false;
    }
    // console.log("the password is now correct");
    const makeRequest = async () => {
      try {
        // const fetch = await import("node-fetch");
        // console.log(`${url}/${token}`);
        const response = await fetch(
          `https://artcity.site/api/v1/users/resetPassword/${token}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password: `${password}`,
              passwordConfirm: `${passwordConfirm}`,
            }),
          }
        );
        if (!response.ok) {
          //   console.log("response", response);
          document.documentElement.innerHTML = expired;
          //   console.log("Token is invalid or has expired");
          return;
        }
        const data = await response.json();
        document.documentElement.innerHTML = verified;
        // console.log(data);
      } catch (error) {
        // console.log(error);
        errorMessage.textContent = "could not create new password! try again";
      }
    };
    makeRequest();
  }

  form.addEventListener("click", validateForm);
});
