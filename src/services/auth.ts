export async function signupUser({
  firstName,
  lastName,
  email,
  username,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}) {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to sign up");
    }

    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    localStorage.setItem(
      "token",
      JSON.stringify({ user: data.user, tokenExpiry })
    );

    return data;
  } catch (error) {
    console.error("Signup error:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Signup failed. Please try again.");
    }
  }
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Invalid email or password");
    }

    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    localStorage.setItem(
      "token",
      JSON.stringify({ user: data.user, tokenExpiry })
    );

    return data;
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Login failed. Please try again.");
    }
  }
}
