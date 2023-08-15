export async function loadUserData() {
  const req = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  const response = await fetch('/api/profile', req);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return await response.json();
}

export async function saveUserData(userData) {
  try {
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to save user data');
    }
    await loadUserData();
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

export async function updateUserData(userData, profileId) {
  try {
    const response = await fetch(`/api/profile/${profileId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user data');
    }
    await loadUserData();
  } catch (error) {
    console.error('Error updating user data:', error);
  }
}

export async function fetchAllServices(profileId, setAllServices) {
  try {
    const url = `/api/service/all?profileId=${profileId}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching data');
    }

    const data = await response.json();

    const filteredAllService = data.filter((business) => {
      const categories = business.categories.map((category) =>
        category.title.toLowerCase()
      );
      return (
        categories.includes('pet sitting') ||
        categories.includes('pet boarding') ||
        categories.includes('pet walking')
      );
    });
    setAllServices(filteredAllService);
    sessionStorage.setItem('AllServices', JSON.stringify(filteredAllService));
  } catch (error) {
    console.error('Error fetching all businesses:', error);
  }
}

export async function fetchOpenServices(profileId, setOpenServices) {
  try {
    const url = `/api/service/open?profileId=${profileId}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching data');
    }
    const data = await response.json();

    const filteredOpenService = data.filter((business) => {
      const categories = business.categories.map((category) =>
        category.title.toLowerCase()
      );
      return (
        categories.includes('pet sitting') ||
        categories.includes('pet boarding') ||
        categories.includes('pet walking')
      );
    });
    setOpenServices(filteredOpenService);
    sessionStorage.setItem('OpenServices', JSON.stringify(filteredOpenService));
  } catch (error) {
    console.error('Error fetching all businesses:', error);
  }
}
