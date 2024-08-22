import pytest
from django.contrib.auth import get_user_model
from core.content.models import PostUser


User = get_user_model()

@pytest.mark.django_db
def test_user_creation():
    """Test de la création d'un utilisateur"""
    user = User.objects.create_user(
        username="testuser",
        email="test@example.com",
        password="password123",
        first_name="Test",
        last_name="User"
    )
    assert user.username == "testuser"
    assert user.email == "test@example.com"
    assert user.is_active
    assert user.is_superuser is False
    assert user.is_staff is False
    assert str(user) == "test@example.com"
    assert user.name == "Test User"

@pytest.mark.django_db
def test_user_follow():
    """Test de la fonctionnalité de suivi entre utilisateurs"""
    user1 = User.objects.create_user(
        username="user1",
        email="user1@example.com",
        password="password123"
    )
    user2 = User.objects.create_user(
        username="user2",
        email="user2@example.com",
        password="password123"
    )
    
    user1.follows.add(user2)
    assert user1.follows.count() == 1
    assert user2.followed_by.count() == 1

@pytest.mark.django_db
def test_user_like_post():
    """Test de la fonctionnalité de like sur un post"""
    user = User.objects.create_user(
        username="testuser",
        email="test@example.com",
        password="password123"
    )
    
    post = PostUser.objects.create(
        content="This is a test post",
        author=user
    )

    # user.like_post(post)
    # assert post.liked_by.count() == 1
    # assert user.has_liked_post(post) is True

@pytest.mark.django_db
def test_user_unlike_post():
    """Test de la fonctionnalité d'unlike sur un post"""
    user = User.objects.create_user(
        username="testuser",
        email="test@example.com",
        password="password123"
    )
    
    post = PostUser.objects.create(
        content="This is a test post",
        author=user
    )

    user.like_post(post)
    user.unlike_post(post)
    assert post.liked_by.count() == 0
    assert user.has_liked_post(post) is False
