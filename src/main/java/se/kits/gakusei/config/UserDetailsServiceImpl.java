//package se.kits.gakusei.config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.authority.AuthorityUtils;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//import se.kits.gakusei.user.model.User;
//import se.kits.gakusei.user.repository.UserRepository;
//
//@Service("userDetailsService")
//public class UserDetailsServiceImpl implements UserDetailsService {
//
//    private final UserRepository repository;
//
//    @Autowired
//    public UserDetailsServiceImpl(UserRepository repository) {
//        this.repository = repository;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
//        User user = this.repository.findByUsername(name);
//        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
//                AuthorityUtils.createAuthorityList(user.getRole()));
//    }
//
//}
